# GPT-3.5-turbo base set up
This repo's purpose is to be a starting point for contextual based chat interactions with Open Ai's [gpt-3.5-turbo](https://platform.openai.com/docs/guides/chat) API.

It is meant to be forked, cloned, and copied so folks can play around with the API. Please customize the styling, break things, and most of all, have fun!

<img width="1294" alt="Screen Shot 2023-03-14 at 7 20 32 AM" src="https://user-images.githubusercontent.com/5130040/224985826-b78c3b8c-9d81-4d8b-ad1d-cb540ec1e48e.png">

# Getting started
1. Clone or fork the repo
2. Run `npm i`
3. Create an `.env` file in root and add your [Open AI API key](https://platform.openai.com/account/api-keys) to it (this file is not tracked)
```javaScript
OPENAI_API_KEY=superSecretAPIKey
```
4. Run `npm run dev`
5. Open in your browser `http://localhost:3000/`
6. Start playing with the context you wish to add in `/app/context/index.ts`

# Under the hood
This is build using [Remix](https://remix.run/) (a react based framework), [Typescript](https://www.typescriptlang.org/), and uses plain css (for now). Some key notes:
- Pages can be found under `/app/routes`
- Styling can be found in `/app/stylesheets` and can be added in the `/app/root.tsx` file in the `links()` function
- Context for the chat interaction should be stored in `/app/context/index.ts` and should follow the data format for [messages](https://platform.openai.com/docs/guides/chat/introduction) (role, content)

# Deployment
This repo was set up to deploy to [Vercel](https://vercel.com/) as the main deplopyment source but you can customize it if you wish to suit your needs.

# Feedback
Would love to hear some feedback. Please feel free to open issues or hit me up on [Twitter](https://twitter.com/JoshSanger_eth).
