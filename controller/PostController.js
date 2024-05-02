const axios = require('axios');

async function getAllPost (req,res){
   try{
   const responsePost = await axios.get(`https://jsonplaceholder.typicode.com/posts`);
   const responseImage = await axios.get(`https://jsonplaceholder.typicode.com/photos`);
    console.log(req.headers.token);
   const postWithImage = responsePost.data.map(postItem => {
      const correspondingImage = responseImage.data.find(img => img.id === postItem.userId);
      if (correspondingImage) {
          return {
              ...postItem,
              imageUrl: correspondingImage.url,
              thumbnailUrl: correspondingImage.thumbnailUrl
          };
      } else {
          return postItem;
      }
  });
  
   res.status(200).json({message:'Successfull',data:postWithImage});
}
catch(error){
   res.status(500).json({message:'server crashed',data:[]});
}
}


module.exports = {getAllPost}