import User from "../models/User.js";

/* READ */
export const getUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(id);
        res.status(200).json(user);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}

export const getUserFriends = async (req, res) => {
    try{
        const { id } = req.params;
        const user = await User.findById(id);

        // USING PROMISE BECAUSE MULTIPLE APIS WILL BE CALLED
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // FORMATTING IN A PROPER WAY FOR THE FRONTD-END
        const formattedFriends = friends.map(
            // _id IS PROVIDED BY MONGODB
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );
        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }  
};

/* UPDATE */
export const addRemoveFriend = async (req, res) => {
    try {
        /* GRABBING THE user AND THE friend FROM THE URL PARAMS(req.params) */
        const { id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        /* IF THE FRIEND ID IS INCLUDED IN THE MAIN USER'S FRIEND-IDS,
        WE WILL REMOVE THAT FRIEND */
        if(user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            // REMOVING THE USER FROM THAT FRIEND'S FRIEND-LIST
            friend.friends = friend.friends.filter((id) => id !== id);
        }
        /* IF THE FRIEND ID IS NOT INCLUDED IN THE MAIN USER'S FRIEND IDS,
        WE WILL ADD THAT FRIEND */
        else { 
            user.friends.push(friendId);
            // ADDING THE USER TO THAT FRIEND'S FRIEND-LIST
            friend.friends.push(id);
        }
        // UPDATING THE DATABASE [save() IS A MONGOOSE METHOD]
        await user.save();
        await friend.save();

        // USING PROMISE BECAUSE MULTIPLE APIS WILL BE CALLED
        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        // FORMATTING IN A PROPER WAY FOR THE FRONTD-END
        const formattedFriends = friends.map(
            // _id IS PROVIDED BY MONGODB
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        );

        res.status(200).json(formattedFriends);
    } catch (err) {
        res.status(404).json({message: err.message});
    }
}