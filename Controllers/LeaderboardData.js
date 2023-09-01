const userScores = require('../Model/userScores');
const UserScores = require('../Model/userScores')


/*
This Page Has
1- Top 10 Global    Get 
2- Top 10 Country   Post
*/

function SortByTime(time) {
    time.sort((a, b) => {
      if (a.duration === null && b.duration === null) {
        return 0; // No change in order if both durations are null
      }
      
      if (a.duration === null) {
        return 1; // Move "a" towards the end if its duration is null
      }
      
      if (b.duration === null) {
        return -1; // Move "b" towards the end if its duration is null
      }
  
      const [minutesA, secondsA] = a.duration.split(":").map(Number);
      const [minutesB, secondsB] = b.duration.split(":").map(Number);
  
      if (minutesA !== minutesB) {
        return minutesA - minutesB;
      }
  
      return secondsA - secondsB;
    });
  }
  

const GlobalTop10  = async(req,res)=>{
    
    try {
        const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
        const currentYear = new Date().getFullYear();

        const resp = await UserScores.aggregate([
            {
                $match: {
                    $expr: {
                        $and: [
                            { $eq: [{ $year: '$createdAt' }, currentYear] },
                            { $eq: [{ $month: '$createdAt' }, currentMonth] },
                        ],
                    },
                },
            },
            {
                $sort: { username: 1, score: -1 }, // Sort by username ascending and score descending
            },
            {
                $group: {
                    _id: '$username',
                    highestScore: { $first: '$score' }, // Get the highest score for each username
                    data: { $first: '$$ROOT' }, // Get the full document with the highest score
                },
            },
            {
                $replaceRoot: { newRoot: '$data' }, // Replace root with the document containing the highest score
            },
        ]);

        
        const sortedData = resp.sort((a, b) => b.score - a.score);
        const top10Data = sortedData.slice(0, 10);

         SortByTime(top10Data)  // sort by duration
        
        res.json(top10Data);


    } catch (error) {
        res.json({ "message": "Cant Fetch Global Data" }).status(401)
    }
}



const CountryTop10 =async(req,res)=>{
 const currentMonth = new Date().getMonth() + 1; // JavaScript months are 0-based
const currentYear = new Date().getFullYear();
const {country} = req.body;

try {
  // Fetch data from MongoDB and sort by scores in descending order
  const data = await userScores.aggregate([
    {
      $match: {
        country: country,
        $expr: {
          $and: [
            { $eq: [{ $year: '$createdAt' }, currentYear] },
            { $eq: [{ $month: '$createdAt' }, currentMonth] }
          ]
        }
      }
    }, {
      $sort: { username: 1, score: -1,duration:-1 }, // Sort by username ascending and score descending
    },
    {
      $group: {
      
        _id: '$username',
        doc: { $first: '$$ROOT' } // Keep the entire document for the first occurrence of each username
      }
    },
    { $replaceRoot: { newRoot: '$doc' } } // Replace the root document with the grouped document
  ]);
  const sortedData = data.sort((a, b) => b.score - a.score);
  const top10Data = sortedData.slice(0, 10);

  // SortByTime(top10Data)  // sort by duration

  res.json(top10Data);
  
} catch (error) {
  console.error(error);
  res.status(500).json({ message: 'An error occurred' });
}

}

module.exports={GlobalTop10,CountryTop10}