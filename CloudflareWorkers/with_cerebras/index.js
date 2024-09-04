// import { Cerebras } from '@cerebras/cerebras_cloud_sdk';


// export default {
//   async fetch(request, env) {
//     const url = new URL(request.url);

//     if (request.method === "POST") {
//       // Handle chat requests
//       const formData = await request.formData();
//       const message = formData.get('message');

//       const chat = {
//         messages: [
//           { role: 'system', content: 'You are a helpful assistant.' },
//           { role: 'user', content: message }
//         ]
//       };

//       const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
//       return new Response(JSON.stringify({ reply: response, userMessage: message }), {
//         headers: { 'Content-Type': 'application/json' }
//       });
//     } else {
//       // Serve the HTML for the chat interface
//       return new Response(html, {
//         headers: { 'Content-Type': 'text/html' }
//       });
//     }
//   }
// };

// const html = `<!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <title>Chatbot</title>
//     <script src="https://unpkg.com/htmx.org@1.9.10"><\/script>
//     <style>
//         body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
//         #chat-container { border: 1px solid #ddd; height: 300px; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
//         #message-input { width: 70%; padding: 5px; }
//         #send-button { padding: 5px 10px; }
//     </style>
// </head>
// <body>
//     <h1>Chatbot</h1>
//     <div id="chat-container"></div>
//     <form hx-post="/" hx-target="#chat-container" hx-swap="none">
//         <input type="text" id="message-input" name="message" placeholder="Type your message..."  autocomplete="off">
//         <button type="submit" id="send-button">Send</button>
//     </form>
//     <script>
//     document.body.addEventListener('htmx:beforeRequest', function(event) {
//         const userMessage = document.getElementById('message-input').value;
//         const chatContainer = document.getElementById('chat-container');
//         chatContainer.innerHTML += '<p><strong>You:</strong> ' + userMessage + '</p>';
//         document.getElementById('message-input').value = '';
//     });

//     document.body.addEventListener('htmx:afterRequest', function(event) {
//         if (event.detail.successful) {
//             const response = JSON.parse(event.detail.xhr.response);
//             const chatContainer = document.getElementById('chat-container');
//             const botReply = response.reply.response;
//             chatContainer.innerHTML += '<p><strong>Bot:</strong> ' + botReply + '</p>';
//             chatContainer.scrollTop = chatContainer.scrollHeight;
//         }
//     });
//     </script>
// </body>
// </html>`;

import { Cerebras } from '@cerebras/cerebras_cloud_sdk';

export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST") {
      try {
        // Handle chat requests
        const formData = await request.formData();
        const message = formData.get('message');

        console.log('Received message:', message);

        if (!env.CEREBRAS_API_KEY) {
          throw new Error('CEREBRAS_API_KEY is not set in environment variables');
        }

        const client = new Cerebras({
          apiKey: env.CEREBRAS_API_KEY,
        });

        console.log('Cerebras client created');

        const completionCreateResponse = await client.chat.completions.create({
          messages: [
            { role: 'system', content: 'You are a helpful assistant.' },
            { role: 'user', content: message }
          ],
          model: 'llama3.1-8b',
        });

        console.log('Received response from Cerebras API');

        const botReply = completionCreateResponse.choices[0].message.content;

        return new Response(JSON.stringify({ 
          reply: botReply, 
          userMessage: message,
          modelInfo: {
            model: completionCreateResponse.model,
            usage: completionCreateResponse.usage,
            timeInfo: completionCreateResponse.time_info
          }
        }), {
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.error('Error in worker:', error);
        return new Response(JSON.stringify({ 
          error: 'An error occurred while processing your request.',
          details: error.message
        }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        });
      }
    } else {
      // Serve the HTML for the chat interface
      return new Response(html, {
        headers: { 'Content-Type': 'text/html' }
      });
    }
  }
};


const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbot llama3.1-8b WITH CEREBRAS</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"><\/script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #chat-container { border: 1px solid #ddd; height: 300px; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
        #message-input { width: 70%; padding: 5px; }
        #send-button { padding: 5px 10px; }
        #model-info { font-size: 0.8em; color: #666; margin-top: 10px; }
    </style>
</head>
<body>
    <h1>Chatbot llama3.1-8b WITH CEREBRAS</h1>
    <div id="chat-container"></div>
    <form hx-post="/" hx-target="#chat-container" hx-swap="none">
        <input type="text" id="message-input" name="message" placeholder="Type your message..."  autocomplete="off">
        <button type="submit" id="send-button">Send</button>
    </form>
    <div id="model-info"></div>
    <script>
    document.body.addEventListener('htmx:beforeRequest', function(event) {
        const userMessage = document.getElementById('message-input').value;
        const chatContainer = document.getElementById('chat-container');
        chatContainer.innerHTML += '<p><strong>You:</strong> ' + userMessage + '</p>';
        document.getElementById('message-input').value = '';
    });

    document.body.addEventListener('htmx:afterRequest', function(event) {
        if (event.detail.successful) {
            const response = JSON.parse(event.detail.xhr.response);
            const chatContainer = document.getElementById('chat-container');
            chatContainer.innerHTML += '<p><strong>Bot:</strong> ' + response.reply + '</p>';
            chatContainer.scrollTop = chatContainer.scrollHeight;

            // CHANGE: Update model info display
            const modelInfo = document.getElementById('model-info');
            modelInfo.innerHTML = \`Model: \${response.modelInfo.model}<br>
                                   Tokens: \${response.modelInfo.usage.total_tokens}<br>
                                   Total Time: \${response.modelInfo.timeInfo.total_time.toFixed(3)}s\`;
        } else {
            console.error('Error in request:', event.detail.xhr.response);
            alert('An error occurred. Please try again.');
        }
    });
    </script>
</body>
</html>`;