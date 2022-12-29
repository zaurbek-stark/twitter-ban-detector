import React, { useCallback, useEffect, useState, useRef } from 'react';
import { wokeKeywords } from './bannedList';
import { openai } from './openai';

const Tweet = ({input, setInput, tweetSentiment}) => {
  const textareaRef = useRef(null);
  const [sentiment, setSentiment] = useState();
  const [suggestedTweet, setSuggestedTweet] = useState();

  const getSentiment = useCallback((rawTweetSentiment) => {
    if (!rawTweetSentiment) return null;
    const basicSentiment = rawTweetSentiment.toLowerCase()?.includes('negative') ? 'negative' : 'positive';
    const isWokeTweet = wokeKeywords.findIndex(word => {
      return input?.toLowerCase()?.includes(word);
    }) > 0;
    return isWokeTweet ? basicSentiment : 'positive';
  }, [input]);

  useEffect(() => {
    setSuggestedTweet();
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

    const formatedTweetSentiment = getSentiment(tweetSentiment);
    setSentiment(formatedTweetSentiment);

    if(formatedTweetSentiment === 'negative') {
      const inputText = `Rewrite this in a politically correct way without changing the meaning: "${input}"`;
      callOpenAI(inputText).then(gpt3Result => {
        setSuggestedTweet(gpt3Result);
      })
    }
  }, [input, tweetSentiment, getSentiment]);

  const sentimentMsg = getSentiment(tweetSentiment)?.includes('negative') ?
    'SJWs are coming for you.' : 'Good to go!';

  return (
    <>
      <div className={`tweet-wrapper ${sentiment}`}>
        <div className="input-box">
          <textarea ref={textareaRef} onChange={() => setSentiment()} className="tweet-area" placeholder="What's happening?"/>
          <div className="privacy">
            <i className="fas fa-globe-asia"></i>
            <span>Everyone can reply</span>
          </div>
        </div>
        <div className="bottom">
          <ul className="icons">
            <li><i className="far fa-file-image"></i></li>
            <li><i className="fas fa-map-marker-alt"></i></li>
            <li><i className="far fa-grin"></i></li>
            <li><i className="far fa-user"></i></li>
          </ul>
          <div className="content">
            <span className="counter">100</span>
            <button onClick={() => setInput(textareaRef.current.value)}>Tweet</button>
          </div>
        </div>
      </div>
      {sentiment && <div className={`sentiment-msg ${sentiment}`}><span>{sentimentMsg}</span></div>}
      {suggestedTweet && <div className="suggested-tweet"><span>{suggestedTweet}</span></div>}
    </>
  );
};

export default Tweet;