import './App.css';
import Tweet from './Tweet';
import { useEffect, useState } from 'react';
import { openai } from './openai';

function App() {
  const [input, setInput] = useState();
  const [tweetSentiment, setTweetSentiment] = useState();

  useEffect(() => {
    const callOpenAI = async (inputText) => {
      const response = await openai.createCompletion({
        model: "text-davinci-002",
        prompt: inputText,
        temperature: 0.5,
        max_tokens: 60,
        best_of: 20,
      });
      return response.data?.choices?.[0]?.text?.replace(/\n/g, '');
    }

    if(input?.length>0) {
      const inputText = `Is this tweet positive or negative: "${input}"?\nTweet sentiment in one word:`;
      callOpenAI(inputText).then(gpt3Result => {
        setTweetSentiment(gpt3Result);
      })
    }
  }, [input]);

  return (
    <div className="App">
      <div className="main-wrapper">
        <div className="title">
          <img src="/twitter-evil.png" width="70px" alt="Evil Twitter" />
          <h2>Ban Detector</h2>
        </div>
        <Tweet input={input} setInput={setInput} tweetSentiment={tweetSentiment} />
      </div>
    </div>
  );
}

export default App;
