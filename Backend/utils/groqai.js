import "dotenv/config";

const getGroqAIAPIResponse = async(message) => {
     const options = {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${process.env.GROQ_API_KEY}`
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages: [{
         role: "user",
         content: message
      }]
    })
  }

    try {
      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", options);
      const data = await response.json();
      //console.log(data.choices[0].message.content);   // reply
      return data.choices[0].message.content;
    } catch(err) {
      console.log(err);
    }
}

export default getGroqAIAPIResponse;