import { readFileSync } from 'fs';
const posts = JSON.parse(readFileSync('./sample-blog-posts.json', 'utf8'));

async function addPosts() {
  for (const post of posts) {
    try {
      const response = await fetch('https://www.cemal.online/api/blog', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(post)
      });

      const data = await response.json();

      if (data.success) {
        console.log(`✅ Added: ${post.title}`);
      } else {
        console.log(`❌ Failed: ${post.title}`);
        console.log(`   Error: ${data.error}`);
      }
    } catch (error) {
      console.log(`❌ Network error for: ${post.title}`);
      console.log(`   ${error.message}`);
    }
  }
}

addPosts();
