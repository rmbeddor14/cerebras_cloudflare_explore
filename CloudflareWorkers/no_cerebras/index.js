
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (request.method === "POST") {
      // Handle chat requests
      const formData = await request.formData();
      const message = formData.get('message');

      const chat = {
        messages: [
          { role: 'system', content: 'You are a helpful assistant.' },
          { role: 'user', content: message }
        ]
      };

      const response = await env.AI.run('@cf/meta/llama-3-8b-instruct', chat);
      return new Response(JSON.stringify({ reply: response, userMessage: message }), {
        headers: { 'Content-Type': 'application/json' }
      });
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
    <title>Chatbot llama-3-8b-instruct NO CEREBRAS</title>
    <script src="https://unpkg.com/htmx.org@1.9.10"><\/script>
    <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
        #chat-container { border: 1px solid #ddd; height: 300px; overflow-y: scroll; padding: 10px; margin-bottom: 10px; }
        #message-input { width: 70%; padding: 5px; }
        #send-button { padding: 5px 10px; }
    </style>
</head>
<body>
    <h1>Chatbot llama-3-8b-instruct NO CEREBRAS</h1>
    <div id="chat-container"></div>
    <form hx-post="/" hx-target="#chat-container" hx-swap="none">
        <input type="text" id="message-input" name="message" placeholder="Type your message..." autocomplete="off">
        <button type="submit" id="send-button">Send</button>
    </form>
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
            const botReply = response.reply.response;
            chatContainer.innerHTML += '<p><strong>Bot:</strong> ' + botReply + '</p>';
            chatContainer.scrollTop = chatContainer.scrollHeight;
        }
    });
    </script>
</body>
</html>`;