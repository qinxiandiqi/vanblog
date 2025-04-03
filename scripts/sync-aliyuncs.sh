VERSION=''
re="\"(version)\": \"([^\"]*)\""

while read -r l; do
  if [[ $l =~ $re ]]; then
    value="${BASH_REMATCH[2]}"
    VERSION="$value"
  fi
done <package.json
                    tag="docker.io/qinxiandiqi/van-blog:v${VERSION}"
tag1="registry.cn-beijing.aliyuncs.com/qinxiandiqi/van-blog:v${VERSION}"
tag2="registry.cn-beijing.aliyuncs.com/qinxiandiqi/van-blog:latest"

echo v${VERSION}
tag="docker.io/qinxiandiqi/van-blog:v${VERSION}"
tag1="registry.cn-beijing.aliyuncs.com/qinxiandiqi/van-blog:v${VERSION}"
tag2="registry.cn-beijing.aliyuncs.com/qinxiandiqi/van-blog:latest"

docker pull ${tag}
docker tag ${tag} ${tag1}
docker tag ${tag1} ${tag2}
docker push ${tag2}
