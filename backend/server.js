const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const natural = require('natural');
const bodyParser = require('body-parser');
const NodeSummarizer = require('node-summarizer').SummarizerManager;
const Sentiment = require('sentiment');


const sentimentAnalyzer = new Sentiment();


require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, { useNewUrlParser: true}); //, useCreateIndex: true

const connection = mongoose.connection;
connection.once('open', () => {
    console.log("MongoDB database connection established successfully");
})

const postsRouter = require('./routes/posts');
app.use('/posts', postsRouter);

// app.listen(port, () => {
//     console.log(`Server is running on port: ${port}`);
// });


app.use(bodyParser.json());

  
app.post('/api/analyze-combined', (req, res) => {
    const { text } = req.body;
  
    const tokenizer = new natural.SentenceTokenizer();
    const sentences = tokenizer.tokenize(text);
  
    const wordFrequencies = {};
    const longWordFrequencies = {};
    const longSentences = [];
    // const passiveSentences = [];
    // const fillerWords = ['really', 'very', 'that', 'essentially', 'in my opinion', 'so'];
    const fillerWordsCount = {};  

    const summarizer = new NodeSummarizer(text , 3);
    const sentiments = [];

    const sentimentLabels = {
      0: 'Very negative',
      1: 'Negative',
      2: 'Neutral',
      3: 'Positive',
      4: 'Very positive'
    };
  
    function isFillerWord(word) {
      const fillerWords = ['a', 'an', 'the', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'with', 'that', 'what', 'when', 'they'];
      return fillerWords.includes(word);
    }
  
    // function isPassiveSentence(sentence) {
    //   const lexicon = new natural.Lexicon("EN", 'N', 'NNP');
    //   const ruleSet = new natural.RuleSet('EN');
    //   const partsOfSpeech = new natural.BrillPOSTagger(lexicon, ruleSet).tag(new natural.WordTokenizer().tokenize(sentence));
    //   for (let i = 0; i < partsOfSpeech.length - 1; i++) {
    //     if (partsOfSpeech[i][1] === 'NN' && partsOfSpeech[i + 1][0] === 'by') {
    //       return true; // Passive sentence detected
    //     }
    //   }
    //   return false; // Not a passive sentence
    // }
  
    const fillerWords = ['really', 'very', 'that', 'essentially', 'in my opinion', 'so'];
  
    sentences.forEach((sentence) => {
      const tokens = new natural.WordTokenizer().tokenize(sentence);
  
      const firstWord = tokens[0].toLowerCase();
      wordFrequencies[firstWord] = (wordFrequencies[firstWord] || 0) + 1;
  
      tokens.forEach((token) => {
        const word = token.toLowerCase();
        if (word.length > 3 && !isFillerWord(word)) {
          longWordFrequencies[word] = (longWordFrequencies[word] || 0) + 1;
        }
  
        if (fillerWords.includes(word)) {
          if (fillerWordsCount[word]) {
            fillerWordsCount[word]++;
          } else {
            fillerWordsCount[word] = 1;
          }
        }
      });
  
      if (tokens.length > 30) {
        longSentences.push(sentence);
      }

    const { score } = sentimentAnalyzer.analyze(sentence);
    let mappedScore;
    if (score > 5){
      mappedScore = 4;
    }
    if (score >= 2 && score < 5){
      mappedScore = 3;
    }
    if (score >= -1 && score <= 1){
      mappedScore = 2;
    }
    if (score >= -5 && score <= -2){
      mappedScore = 1;
    }
    if (score < -5){
      mappedScore = 0;
    }
    const label = sentimentLabels[mappedScore]; // Map sentiment score to sentiment label
    sentiments.push({ label });
  
      // if (isPassiveSentence(sentence)) {
      //   passiveSentences.push(sentence);
      // }
    });
  
    const frequencies = Object.entries(wordFrequencies).map(([word, frequency]) => ({
      word,
      frequency,
    }));
  
    const longWordFrequenciesArray = Object.entries(longWordFrequencies).map(([word, frequency]) => ({
      word,
      frequency,
    }));
  
    const sortedFrequencies = frequencies.sort((a, b) => b.frequency - a.frequency);

    const sortedLongWordFrequencies = longWordFrequenciesArray.slice(0, 5).sort((a, b) => b.frequency - a.frequency);
  
    const fillerWordsOccurrences = Object.entries(fillerWordsCount).map(([word, count]) => ({
      word,
      count,
    }));
  
    let summary = '';
    if (sentences.length > 1) {
      
      summary = summarizer.getSummaryByFrequency().summary;

    }
  
    res.json({
      sentiments,
      frequencies: sortedFrequencies,
      longWordFrequencies: sortedLongWordFrequencies,
      longSentences,
      // passiveSentences,
      fillerWordsOccurrences,
      summary,
    });
  });
  
  

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
