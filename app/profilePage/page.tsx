import Image from "next/image";

const Profile = () => {
  return (  
    <div className="h-full w-3/5">
      <Image src="/tomCruisePhoto.jpg" alt='Employee photo' fill className='rounded-md mx-5 object-contain'/>
    </div>
  );
}
 
export default Profile;