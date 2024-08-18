import React, { useEffect, useState } from "react";
import axios from "axios";

interface UserProfileProps {
  botToken: string;
  userId: string | number;
}

const UserProfile: React.FC<UserProfileProps> = ({ botToken, userId }) => {
  const [userName, setUserName] = useState<string>("");
  const [userAvatar, setUserAvatar] = useState<string>("");

  useEffect(() => {
    // Fetch user data
    const fetchUserData = async () => {
      try {
        // Get user profile information
        const userResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getChat?chat_id=${userId}`
        );
        setUserName(userResponse.data.result.first_name);

        // Get user profile photos
        const photosResponse = await axios.get(
          `https://api.telegram.org/bot${botToken}/getUserProfilePhotos?user_id=${userId}&limit=1`
        );

        if (
          photosResponse.data.result.photos &&
          photosResponse.data.result.photos.length > 0
        ) {
          const fileId =
            photosResponse.data.result.photos[0][0].file_id; // Get the file_id of the smallest photo
          // Get the file path
          const fileResponse = await axios.get(
            `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
          );
          const filePath = fileResponse.data.result.file_path;
          const avatarUrl = `https://api.telegram.org/file/bot${botToken}/${filePath}`;

          setUserAvatar(avatarUrl);
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [botToken, userId]);

  return (
    <div style={styles.container}>
      <img src={userAvatar} alt="User Avatar" style={styles.avatar} />
      <p style={styles.name}>{userName}</p>
    </div>
  );
};

const styles = {
  container: {
    display: "flex",
    alignItems: "center",
    padding: "10px",
    backgroundColor: "#f5f5f5",
    borderRadius: "8px",
    position: "absolute" as "absolute", // Explicitly cast to the 'Position' type
    top: "10px",
    left: "10px",
  },
  avatar: {
    width: "40px",
    height: "40px",
    borderRadius: "50%",
    marginRight: "10px",
  },
  name: {
    fontSize: "16px",
    fontWeight: "bold",
    margin: 0,
  },
};

export default UserProfile;
