import "./style.css";
import React from "react";
import {useNavigate} from 'react-router-dom';





const ErrorPage=()=>{
  const navigate = useNavigate();


return(
  <div class="full">
<div class="mars"></div>
<img src="https://assets.codepen.io/1538474/404.svg" class="logo-404" alt="doodle error" />
<img src="https://assets.codepen.io/1538474/meteor.svg" class="meteor" alt="doodle error" />
<p class="title">Oh no!! Doodle not found😧</p>
<p class="subtitle">
	You’re either misspelling the URL <br /> or requesting a page that's no longer here.
</p>
<div align="center">
	<a class="btn-back" onClick={()=>navigate("/")}>Back to Doodle page</a>
</div>
<img src="https://assets.codepen.io/1538474/astronaut.svg" class="astronaut" alt="doodle error"/>
<img src="https://assets.codepen.io/1538474/spaceship.svg" class="spaceship" alt="doodle error"/>
  
</div>
  )
}

export default ErrorPage;