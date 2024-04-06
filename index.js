import  Configuration from 'openai';
import  OpenAIApi from 'openai';
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import * as dotenv from 'dotenv'

dotenv.config()

const configuration = new Configuration({
    apiKey: process.env.OPEN_AI_API_KEY,
    organization: process.env.ORGANIZATION
});

const app = express();
const port = 3000;

// Express config
app.use(cors());
app.use(bodyParser.json());


const openai = new OpenAIApi(configuration); // Pass the configuration instance


// Route that will get the keywords and dataset size from the user and return the top 3 datasets from Kaggle`
// https://azuregpt.azurewebsites.net/api/firstAPI?
app.post('/', async (req, res) => {
   // Refactor prompt eng

   try {
      const { keywords, datasetSize } = req.body;

      const chatCompletion = await openai.chat.completions.create({
         model: "gpt-4",
         temperature: 0.1,
         max_tokens: 700,
         
         messages: [{
                     "role": "system", 
                     "content": "You are an assistant that given a topic and size of dataset which could be small/medium/large, returns the 3 best dataset from Kaggle for a data analysis project."
                  },
                  {
                     "role": "user", 
                     "content": `Given the topic ${keywords} and a preference for ${datasetSize} datasets, list the top 3 Kaggle datasets suitable for a Data Analysis project. For each dataset, provide its title, a short description, number of columns, number of rows, date and the link of the dataset in a structured format.
- No intro paragraph
- No ending paragraph
- If you can't find a dataset which is required don't write an apology paragraph, just write the 3 most real related datasets with valid links options.
- you must return exactly 3 options, in the given format.
- If you can't find 3 datasets that are related, return the top 3 options that you did find that are best fitted for this project
- Don't give titles for the links, return only the URLs
- your answer should be only in the next structured format:
!Title: "Steam Video Game"
@Description: "Data for top video games on steam"
#Columns: 5
$Rows: 10000
%Date: "2021-07-01"
^Link: "https://www.kaggle.com/tamber/steam-video-games"
`}],
         });

         console.log('fetched data from open ai api:', JSON.stringify(chatCompletion?.choices[0]?.message))

         const response = chatCompletion?.choices[0]?.message ? chatCompletion.choices[0].message : 'no data found'
   
         res.json({
            completion: response
         });
   } catch (err) {
      console.log('had en error', err)
   }

   
    
});

// Route that will get the selected dataset and buzzwords from the user and return the step-by-step guide for the data analysis project
app.post('/instructions', async (req, res) => {
   try {
      const data = req.body.selectedRec
      const buzzwords = req.body.selectedBuzz
      console.log('buzzwords: ', buzzwords)

      const chatCompletion = await openai.chat.completions.create({
         model: "gpt-4",
         temperature: 0.1,
         max_tokens: 7000,

         messages: [
               {  
                  "role": "system", 
                  "content": "You are an assistant that, given a dataset from Kaggle, helps generate a step-by-step guide for a data analysis project which will be built using python."
               },
               {
                  "role": "user", 
                  "content": `Please generate a response to this dataset: ${data.link} Here are the dataset attributes:
Title: ${data.title}
Description: ${data.description}
Columns: ${data.columns}
Rows: ${data.rows}
Date: ${data.date}
Link: ${data.link}

Guidelines for formatting:
- Never do a line break in your answer!
- No intro paragraph
- No ending paragraph
- There should be steps number as 1,2,3, ... etc - we will refer them as level 1 
- There should be sub-steps as 1.1, 1.2, ... etc  - we will refer them as level 2
- There should be sub-sub-steps as 1.1.1, 1.1.2, ... etc  - we will refer them as level 3
- You have to use at least 4 level 2 steps for every level 1 step
- You have to use at least 2 level 3 steps to every level 2 step
- Use a lot of steps for each level.
- Use between 5 to 10 level 1 steps for the project 
- Data Preprocessing, EDA, ${buzzwords} must be included as concepts in the project as part of  level 1 steps or level 2  steps or level 3 steps
- Don't use **<Title>** for example: Import Necessary Libraries instead of **Import Necessary Libraries**
- Don't mention the data set link
- Each title should be starting with @@, following the $ corresponding to it's level - for example: @@$1. Data preparations, @@$$1.1 Delete duplicate rows, @@$$$1.1.1 Identify duplicate rows
- Each step should have some tooltip information about the step, the tooltip content will start with a #. for example: @@$1. Data preparations #In this step...
- Make the steps for the data analysis tasks related to the selected database and what it displays. Offer interesting ideas for analysis and prediction based on the data, offer interesting variables worth checking the relationship between, etc.
- you must include a rich tooltip for the level 3 steps. 
- In the level 3 step's tooltips, you must give examples in python code as part of the tooltip content.
- Don't use # before the examples.`
               }
            ], 
         });

         console.log('fetched data from open ai api:', JSON.stringify(chatCompletion?.choices[0]?.message))

         const response = chatCompletion?.choices[0]?.message ? chatCompletion.choices[0].message : 'no data found'
   
         res.json({
            completion: response
         });
   } catch (err) {
      console.log('had en error', err)
   }

})

app.listen(port, () => {
      console.log(`Server is running on port http://localhost:${port}`);
   });