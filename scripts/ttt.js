const fs = require('fs');
const path = require('path');
const axios = require('axios');
const crypto = require('crypto');

async function downloadImage(imageUrl, postId) {
    const { default: imageType } = await import('image-type');
    try {
      const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
      const buffer = Buffer.from(response.data);
      const type = await imageType(buffer);
      console.log(type);
      if (!type) {
        throw new Error('无法确定图片类型');
      }
  
    //   // 创建文章的图片目录
    //   const postImagesDir = path.join(CONTENT_DIR, postId, 'images');
    //   if (!fs.existsSync(postImagesDir)) {
    //     fs.mkdirSync(postImagesDir, { recursive: true });
    //   }
  
    //   // 生成图片文件名
    //   const hash = crypto.createHash('md5').update(imageUrl).digest('hex');
    //   const imageName = `${hash}.${type.ext}`;
    //   const imagePath = path.join(postImagesDir, imageName);
      
    //   // 保存图片
    //   fs.writeFileSync(imagePath, buffer);
      
    //   // 返回相对路径
    //   return `./images/${imageName}`;
    } catch (error) {
      console.error(`下载图片失败: ${imageUrl}`, error);
      return imageUrl; // 如果下载失败，返回原始URL
    }
  }


async function main() {
    downloadImage("https://prod-files-secure.s3.us-west-2.amazonaws.com/da864e11-683f-4c2d-a264-16ecdf57fff9/4b771ec1-c5e2-4b86-94fe-c740bc7b3793/image.png?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Content-Sha256=UNSIGNED-PAYLOAD&X-Amz-Credential=ASIAZI2LB466R5SASQWU%2F20250617%2Fus-west-2%2Fs3%2Faws4_request&X-Amz-Date=20250617T095554Z&X-Amz-Expires=3600&X-Amz-Security-Token=IQoJb3JpZ2luX2VjEIr%2F%2F%2F%2F%2F%2F%2F%2F%2F%2FwEaCXVzLXdlc3QtMiJHMEUCICSYcirukGRK0wj34RTzC6tNYitEHfAcWR5RRxwRSWnkAiEAjgKvR9LsDe0EpXV%2Fulgnzttbd4ht2c0wNZwaGhGsEasq%2FwMIcxAAGgw2Mzc0MjMxODM4MDUiDEME7ulVY8ePV1jnZCrcAx2GDVGl7t1h8l0%2BqzDZC8jaLtI9gQZznQzh6ADJITPayU%2Fhxp%2FpkRFUkVhGH%2FOvLz3kDf2od%2BZlBqGJhBEpvbZ55EJFnUIjwaOgpqGrqOcXCpHt%2FfKOVT%2BndsYFvmKIYAaWaPm%2BljeU9Zo6IRPF6Tdvj3rgGiTp1VP%2FVkuy0y6HB75pWFklyDTKwqKHcR3a%2FKnmwSNky17HRinF8XykvVdy1o55D0zA6%2FEjJp5vKgwI6bMREDClY5MB5rQUfvH%2FPkM7k4uNToCz65meZS8UZlgM6vmyFejNeS7qUrVimq6TXuUEbV9WqeNpuCZJ6IT0rgyGm0zjzkqHP6WiluTDPn6ZV8q4NIVmBryQugOQTlB3oYvinDashfiHAa5EJn0PmlMItBaGrXRNQWEzu2EoWcwFPF1M8EOB5m6Nrw3n1ActCTt1RYvfwqZV39mQfKRDj2pGJ8NHdnHW%2F5uEq0ZRMCfFErF%2Bn6HaG4ulmmqc7j1n%2BVSrpU69Nc48sqzRSuqja1ltI8L3VLh%2FZVVnKgD%2Bwamc3CNvLR5SB1maorsw%2Bo8I3I%2BSCwUFnaY5e%2FtFyldSZvgBKYZJvoq5p9UQuSk%2F9D8lFaCUNzigkgAZ8laUlM86pkPwGEsjnEwtSlKUMIPuxMIGOqUBIrcXWI5lgNHNoMyRYbxM60R3iyt2Yt7wEiqJ9K9QPBXFJ6iXbOWRUQWgyqyX2d0KMcgUK5HVj37XNK9g2IqiTmIEWnfFn2LPLIHoaY7ZlsB4K%2FGODPT%2BvOPaLocWbSjaJDkZhL%2BbbJ9MqIi5%2BBvXx0itCW0Kdsi9%2BWV4%2Bm2OUjjTgHBC9dIEDRrHB4%2BXH6vsbMcA5%2FBQ714xP0nLr3WncSqV11ql&X-Amz-Signature=a3db471f7feaa3f4114757780f5a3490e112baf7aad2f1e8734c6d51bfde8ed7&X-Amz-SignedHeaders=host&x-amz-checksum-mode=ENABLED&x-id=GetObject")
}


main()