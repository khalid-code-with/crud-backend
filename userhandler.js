 
import User from "../models/usermodels.js";
import conversation from "../models/conversationalModel.js";

// User search by username or fullname
export const getuserbysearch = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Log authenticated user
    if (!req.user) {
      return res.status(401).send({
        success: false,
        message: "User not authenticated"
       
      });
    }
    const search = req.query.search || ''; // Get search query
    console.log("Search Query:", search); // Log search query
    const currentuserID = req.user._id; // Get current user ID

    // Finding users
    const users = await User.find({
      $and: [
        {
          $or: [
            { username: { $regex: search, $options: 'i' } }, // Search by username
            { fullname: { $regex: search, $options: 'i' } }  // Search by fullname
          ]
        },
        {
          _id: { $ne: currentuserID } // Exclude current user
        }
      ]
    }).select("-password").select("-email"); // Exclude password and email from results
res.status(200).send(users);
  } catch (error) {
    console.error("Search Error:", error); // Log error for debugging
    return res.status(500).send({
      success: false,
      message: error.message || "Internal Server Error"
    });
  }
};


// export const getcurrentchatters = async (req, res) => {
//   try {
//     console.log("Authenticated User for Chatters:", req.user); // Log authenticated user
//     if (!req.user) {
//       return res.status(401).send({
//         success: false,
//         message: "User not authenticated"
//       });
//     }

//     const currentuserID = req.user._id; // Get current user ID

//     // Finding current chatters
//     const currentchatters = await conversation.find({
//       participants: currentuserID // Find conversations with the current user
//     }).sort({
//       updatedAt: -1 // Sort by last updated time
//     });

//     if (!currentchatters || currentchatters.length === 0) {
//       return res.status(200).send([]); // Return empty array if no chatters found
//     }

//     const participantsIDS = currentchatters.reduce((ids, conversation) => {
//       const otherParticipants = conversation.participants.filter(id => id.toString() !== currentuserID.toString());
//       return [...ids, ...otherParticipants]; // Collect participant IDs
//     }, []);

//     const uniqueParticipantIds = [...new Set(participantsIDS)]; // Remove duplicates
//     const users = await User.find({ _id: { $in: uniqueParticipantIds } })
//       .select("-password -email"); // Exclude password and email

//     return res.status(200).send(users); // Send found users
//   } catch (error) {
//     console.error("Chatters Error:", error); // Log error for debugging
//     return res.status(500).send({
//       success: false,
//       message: error.message || "Internal Server Error"
//     });
//   }
// };
export const getcurrentchatters = async (req, res) => {
  try {
    console.log("Authenticated User for Chatters:", req.user); // Log authenticated user
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated"
      });
    }

    const currentuserID = req.user._id; // Get current user ID

    // Finding current chatters
    const currentchatters = await conversation.find({
      participants: currentuserID // Find conversations with the current user
    }).sort({
      updatedAt: -1 // Sort by last updated time
    });

    if (!currentchatters || currentchatters.length === 0) {
      return res.status(200).json([]); // Return empty array if no chatters found
    }

    const participantsIDS = currentchatters.reduce((ids, conversation) => {
      const otherParticipants = conversation.participants.filter(id => id.toString() !== currentuserID.toString());
      return [...ids, ...otherParticipants]; // Collect participant IDs
    }, []);

    const uniqueParticipantIds = [...new Set(participantsIDS)]; // Remove duplicates
    const users = await User.find({ _id: { $in: uniqueParticipantIds } })
      .select("-password -email"); // Exclude password and email

    console.log("Fetched Chatters:", users); // Log found users

    // Ensure the response is compatible with Postman
    return res.status(200).json({
      success: true,
      data: users
    });
  } catch (error) {
    console.error("Chatters Error:", error); // Log the complete error for debugging
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
      stack: error.stack // Include stack trace for more details (remove in production)
    });
  }
};


