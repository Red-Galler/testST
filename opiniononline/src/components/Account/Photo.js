import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';

function Photo() {
  const [imageUrl, setImageUrl] = useState(null);
  const [id, setId] = useState(null);

  useEffect(() => {
    async function getProfile() {
      let session = await supabase.auth.getSession();
      const userId = session.data.session.user.id;
      setId(userId);
      getImage(userId);

      const subscription = supabase
        .channel(`heeey`)
        .on('postgres_changes', { event: '*', schema: 'storage', table: 'objects' }, payload => {
          switch (payload.eventType) {
            case 'UPDATE':
              if (payload.new.owner == userId) {
                getImage(userId);
              }
              break;
            default:
              break;
          }
        })
        .subscribe();

      return () => {
        subscription.unsubscribe();
      }
    }

    getProfile();

    async function getImage(userId) {
      const { data, error } = await supabase.storage.from('user_profile_pictures').download("profile_" + userId);

      if (error) {
        console.error('Fout bij het ophalen van de afbeelding', error);
      } else {
        const url = URL.createObjectURL(data);
        setImageUrl(url);
      }
    }
  }, []);

  return (
    <div className='flex justify-center items-center rounded-full bg-green-300 p-2 border border-black w-16 h-16'>
      <img src={imageUrl} alt="Profielafbeelding" className='rounded-full w-full h-full'></img>
    </div>
  );
}

export default Photo;