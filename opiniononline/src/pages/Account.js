import { useContext } from "react";
import ProfilePicture from "../components/Account/ProfilePicture";

import { userContext } from '../App';

function Account() {
  const userUID = useContext(userContext); // Get the user UID using the hook

  return (

    <div className="border">
      <p>Account</p>
      <p>User UID: {userUID}</p>
      <ProfilePicture currentUser={userUID} />
    </div>

  );
}

export default Account;
