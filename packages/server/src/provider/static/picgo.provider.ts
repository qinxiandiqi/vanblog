import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { StaticType, StoragePath } from 'src/dto/setting.dto';
import * as fs from 'fs';
import * as path from 'path';
import { config } from 'src/config';
import { imageSize } from 'image-size';
import { formatBytes } from 'src/utils/size';
import { PicGo } from 'picgo';
import { SettingProvider } from '../setting/setting.provider';
import { ImgMeta } from 'src/dto/img';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { SettingDocument } from 'src/scheme/setting.schema';
@Injectable()
export class PicgoProvider {
  picgo: PicGo;
  constructor(
    @InjectModel('Setting')
    private settingModel: Model<SettingDocument>,
  ) {
    this.picgo = new PicGo();
    this.initDriver();
  }
  async getSetting() {
    const res = await this.settingModel.findOne({ type: 'static' }).exec();
    if (res) {
      return res?.value || { storageType: 'local', picgoConfig: null };
    }
    return null;
  }
  async initDriver() {
    const staticSetting = await this.getSetting();
    const picgoConfig = staticSetting?.picgoConfig;

    if (picgoConfig) {
      this.picgo.setConfig(picgoConfig);
    }
  }
  async saveFile(fileName: string, buffer: Buffer, type: StaticType) {
    const result = imageSize(buffer);
    const byteLength = buffer.byteLength;

    const meta: ImgMeta = { ...result, size: formatBytes(byteLength) };
    // 搞一个临时的
    const srcPath = path.join(config.staticPath, 'tmp', fileName);
    fs.writeFileSync(srcPath, buffer);
    let realPath = undefined;
    try {
      const res = await this.picgo.upload([srcPath]);
      realPath = res[0].imgUrl;
    } catch (err) {
      throw err;
    } finally {
      fs.rmSync(srcPath);
    }
    return {
      meta,
      realPath,
    };
  }
  async deleteFile(fileName: string, type: StaticType) {
    const storagePath = StoragePath[type] || StoragePath['img'];
    const srcPath = path.join(config.staticPath, storagePath, fileName);
    fs.rmSync(srcPath);
  }
}
