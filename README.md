# GPT-3.5-turbo base template
This repo's purpose is to be a starting point for contextual based chat interactions with Open Ai's [gpt-3.5-turbo](https://platform.openai.com/docs/guides/chat) API.

It is meant to be forked, cloned, and copied so folks can play around with the API. Please customize the styling, break things, and most of all, have fun!

[Check out the step by step guide](https://medium.com/@joshua.v.sanger/building-a-context-loaded-chat-assistant-with-openai-and-remix-9f72c6d7962b)

<img width="999" alt="Screen Shot 2023-03-19 at 10 54 56 PM" src="https://user-images.githubusercontent.com/5130040/226919242-846e12ce-a31c-4281-89d5-81267e76842f.png">


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
This is build using [Remix](https://remix.run/) (a react based framework), [Typescript](https://www.typescriptlang.org/), and uses [Tailwind](https://tailwindcss.com/) for CSS. Some key notes:
- Pages can be found under `/app/routes`
- Styling can be found in `/app/stylesheets` and can be added in the `/app/root.tsx` file in the `links()` function
- Context for the chat interaction should be stored in `/app/context/index.ts` and should follow the data format for [messages](https://platform.openai.com/docs/guides/chat/introduction) (role, content)

# Deployment
This repo was set up to deploy to [Vercel](https://vercel.com/) as the main deplopyment source but you can customize it if you wish to suit your needs.

# Feedback
Would love to hear some feedback. Please feel free to open issues or hit me up on [Twitter](https://twitter.com/JoshSanger_eth).
