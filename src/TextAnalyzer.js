import React, { useState } from 'react';
import axios from 'axios';
// import 'bootstrap/dist/css/bootstrap.min.css';
// import './bootstrapcustom.css';

const TextAnalyzer = () => {
  const [text, setText] = useState('');
  const [frequencies, setFrequencies] = useState([]);
  const [longWordFrequencies, setLongWordFrequencies] = useState([]);
  const [longSentences, setLongSentences] = useState([]);
  // const [passiveSentences, setPassiveSentences] = useState([]);
  const [fillerWordsCount, setFillerWordsCount] = useState({});
  const [summary, setSummary] = useState('');
  const [synonymsList, setSynonymsList] = useState([]);
  const [sentiments, setSentiments] = useState([]);



  const handleChange = (event) => {
    setText(event.target.value);
  };

  // const fetchSynonyms = async () => {
  //   const wordList = longWordFrequencies.slice(0, 5).map((frequency) => frequency.word);

  //   const newSynonymsList = [];
  //   for (const word of wordList) {
  //     const options = {
  //       method: 'GET',
  //       url: `https://wordsapiv1.p.rapidapi.com/words/${word}/synonyms`,
  //       headers: {
  //         'X-RapidAPI-Key': '5a13954628mshb4abc2d3b9c74a6p1c4403jsn784f7435a766',
  //         'X-RapidAPI-Host': 'wordsapiv1.p.rapidapi.com'
  //       }
  //     };

  //     try {
  //       const response = await axios.request(options);
  //       const synonyms = response.data.synonyms.slice(0, 5);
  //       newSynonymsList.push({ word, synonyms });
  //     } catch (error) {
  //       console.error(error);
  //     }
  //   }

  //   setSynonymsList(newSynonymsList);
  // };
  const fetchSynonyms = async () => {
    const wordList = longWordFrequencies.slice(0, 5).map((frequency) => frequency.word);
  
    const newSynonymsList = [];
    for (const word of wordList) {
      const options = {
        method: 'GET',
        url: `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`
      };
  
      try {
        const response = await axios.request(options);
        const meanings = response.data[0]?.meanings;
        const synonyms = meanings.map((meaning) => meaning.definitions[0]?.synonyms?.slice(0, 5));
        newSynonymsList.push({ word, synonyms });
      } catch (error) {
        console.error(error);
      }
    }
  
    setSynonymsList(newSynonymsList);
  };
  
  

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      const response = await axios.post('http://localhost:5000/api/analyze-combined', { text });
      const sortedFrequencies = response.data.frequencies.sort((a, b) =>
        b.frequency - a.frequency
      );
      setFrequencies(sortedFrequencies);

      const sortedLongWordFrequencies = response.data.longWordFrequencies.sort((a, b) =>
        b.frequency - a.frequency
      );
      setLongWordFrequencies(sortedLongWordFrequencies);

      const longSentencesArray = response.data.longSentences;
      setLongSentences(longSentencesArray);

      const sentiments = response.data.sentiments;
      setSentiments(sentiments);

      const fillerWordsCountData = response.data.fillerWordsOccurrences.reduce(
        (acc, { word, count }) => ({ ...acc, [word]: count }),
        {}
      );
      setFillerWordsCount(fillerWordsCountData);

      const summaryData = response.data.summary;
      setSummary(summaryData);

      fetchSynonyms();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ padding: '15px', maxWidth: '90%'}}> 
      <h1>Text Analyzer</h1>
      <form onSubmit={handleSubmit}>
        <textarea
          rows="8"
          cols="50"
          value={text}
          onChange={handleChange}
          placeholder="Paste your text here..."
          required
        ></textarea>
        <button type="submit">Analyze</button>
      </form>
      <div class="container-wrapper">
        {frequencies.length > 0 && (
          <div class="container">
            <h5>Your sentences tend to start with the following words:</h5>
            <ul>
              {frequencies.slice(0, 5).map((frequency, index) => (
                <li key={index}>
                  <strong>{frequency.word.charAt(0).toUpperCase() + frequency.word.slice(1)}</strong>: {frequency.frequency}
                </li>
              ))}
            </ul>
          </div>
        )}

        {longWordFrequencies.length > 0 && (
          <div class="container">
          <h5>Here are some synonyms for the most frequent words in the text:</h5>
          <div class="container-wrapper">
            <div class="container-wrapper2">
              {longWordFrequencies.slice(0, 5).map((frequency, index) => (
                <div class="smallcontainer" key={index}>
                  <div>
                    <strong>{frequency.word.charAt(0).toUpperCase() + frequency.word.slice(1)}</strong>: {frequency.frequency}
                  </div>
                  <ul>
                    {synonymsList[index] && synonymsList[index].synonyms.map((synonym, idx) => (
                      <li key={idx}>{synonym}</li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
        )}



        {longSentences.length > 0 && (
          <div class="container">
            <div>
              <h5>The following sentences may be too long (More than 30 words). Try to make them more concise or separate them into multiple sentences:</h5>
              <ul class="ulIs">
                {longSentences.map((sentence, index) => (
                  <li key={index}>{sentence}</li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {sentiments.length > 0 && (
          <div className="container">
            <div>
              <h5>Your sentences seem to have the following sentiment progression:</h5>
              <p>
                {sentiments.map((item, index) => (
                  <span key={index}>
                    {item.label}
                    {index !== sentiments.length - 1 && " -> "}
                  </span>
                ))}
              </p>
            </div>
          </div>
        )}


        {Object.keys(fillerWordsCount).length > 0 && (
          <div className="container">
            <div>
              <h5>Filler Words Count:</h5>
              <ul>
                {Object.entries(fillerWordsCount).map(([word, count]) => (
                  <li key={word}>
                    <strong>{word}</strong>: {count}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}

        {summary && (
          <div className="container">
            <h5>Key Sentences in Your Writing:</h5>
            <p>{summary}</p>
          </div>
        )}

      </div>
    </div>

  );
};

export default TextAnalyzer;