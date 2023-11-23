import react from 'react';


export default function Logout(){
    const cleartokenData = () => {
        if(sessionStorage.getItem('token')){
        sessionStorage.clear();
        document.location.reload();
        }
    }
    return(
        <button onClick={cleartokenData}>Logout</button>
    );
}