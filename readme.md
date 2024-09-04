# See How Fast Cerebras Is! 

### Background
- I attended an evening event from CloudFlare, Weaviate, and Cerebras Event on 09-03-2024
- I made this entire demo in like an hour and I'm super proud of that! It goes without saying that a combination of gen ai tools wrote most of this code 😜
- I didn't use Weaviate because I had already explored their software. But super grateful to Weaviate and their awesome Dev Advocate, Adam, for hosting this event!! 
- I was most interested in exploring the [Cerebras](https://cerebras.ai/) performance. This was not just because a certain gpu company's stock is funding my career break and I want to check out the competition (just kidding!!!) but also because I have a feeling that we are at the very, very beginning of ai adoption - as more and more businesses start adopting gen ai in their software and processes, the demand for inference will be just as strong as the demand for training hardware. Potentially. IDK I don't have a crystal ball though. 🔮
- my intention isn't really to *compare* cloudflare and cerebras, just to explore here! There are so many factors involved that there is no way I could have made a true AB test in an hour! 


### Demo 
- my demo uses two cloudflare workers 
- one uses the standard ai package from cloudflare 
- one uses the same structure, but uses Cerebras to request and answer the query 
- both use a version of `llama-3-8b` model (the "No Cerebras" one uses `llama-3-8b-instruct`)

#### Without Cerebras
[![Watch the video](img/no_cerebras_screenshot.png)](https://www.youtube.com/watch?v=vTgv9_W19HU)

#### With Cerebras 
[![Watch the video](img/with_cerebras.png)](https://youtu.be/R2KeB7jZKu8)




### How to Run this Code

- deploy a worker on cloudflare 
- change the name in the `wrangler.toml` section of this code to the name of the worker you just deployed
- then: 
    ```
    npm install -g wrangler
    wrangler login
    wrangler deploy
    ```
    - for the code with Cerebras 
    ```
    npm install @cerebras/cerebras_cloud_sdk
    wrangler login
    wrangler secret put CEREBRAS_API_KEY   
    ```

    - then fill in the secret (you can also put in your toml but I need to take it out because i'm posting this on github)




#### To Do / My thoughts and questions! 
- understand more deeply the differences between the two code bases (like the Cerebras one doesn't only do inference, right? how does this impact our outcome?) It's important to me to understand each difference so I can better evaluate Cerebras. 
    - how important is inference vs requesting? 
    - where is my bottleneck in each app? 
    - make an arch diagram for each! 
- double check the instructions for how to run the code and update it so other people (even people without nodejs experience) can try! 
- Does cerebras play a role in other ai applications that are not generative? (e.g. the instagram algo I'm addicted to)
- make the text on the chatbot come through streaming (like chatgpt) instead of all at once so that it's a more interesting and less boring demo! 
- maybe I should set my cloudflare worker to use like a certain NVIDIA cluster or something? or do another one that calls openAI's API? That way you would see a better comparison between the different hardware. Because right now I'm just using CloudFlare's free tier and it's probably not giving me as much hardware as the API from Cerebras is ? 
    - how do i know what kind of hardware my "no cerebras" inference is running on? It seems like it's calling the CloudFlare ai api (not just running on the worker) - how does this impact our latency? 
    - how do people adjust things like this in PROD? 
    - looking forward to learning more and more about trade-offs with this!! 

#### Did you go to Georgia Tech and Live in the Bay Area??
I'm volunteering with the bay area GT alumni association and trying to reach more people. So if you're in this demographic and for some reason reading to the bottom of this github readme, please contact me - I want to add you to the list!!   🐝🐝