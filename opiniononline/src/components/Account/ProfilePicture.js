import React, { useState } from "react";
import { supabase } from '../../supabaseClient';


function ProfilePicture({ currentUser }) {

  console.log(currentUser);
  const [loading, setLoading] = useState(false);

  const fileChangedHandler = async (e) => {
    const file = e.target.files[0];

    if (!file) {
      console.error("No file uploaded.");
      return;
    }

    setLoading(true);

    console.log(file);
    let filename = 'profile_' + currentUser;
    console.log(filename);

    
    const { data, error } = await supabase
    .storage
    .from('user_profile_pictures')
    .update(filename, file, {
      //cacheControl: '3600',
      upsert: false
    })

    setLoading(false);
  };

  return (
    <div className="mt-4 rounded-lg bg-gray-50 dark:bg-slate-600 p-8">
      <div className="flex items-center justify-between">
        <span className="text-md font-bold text-gray-900">
          Change Profile Picture
        </span>
        <div>
          <input
            type="file"
            onChange={fileChangedHandler}
            style={{ display: "none" }}
            id="fileUpload"
          />
          {loading ? (
            <div>Loading...</div>
          ) : (
            <button
              onClick={(e) => {
                e.preventDefault();
                document.getElementById("fileUpload").click();
              }}
              className="text-md w-36 cursor-pointer rounded-lg bg-custom-blue p-1 py-2 px-6 font-semibold text-custom-darkest-blue duration-200 
                         hover:bg-custom-dark-blue dark:bg-custom-dark-blue "
              disabled={loading}
            >
              Choose File
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePicture;