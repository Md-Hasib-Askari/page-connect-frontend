import Cookies from 'js-cookie';
import { saveAccessToken } from "@/api/fetchAPI";
import { TOKEN_KEY } from './constants';

export const fbInit = () => {
	/* eslint-disable */
	// @ts-ignore
    (function(d, s, id){
        var js, fjs = d.getElementsByTagName(s)[0];
        if (d.getElementById(id)) {return;}
        js = d.createElement(s); js.id = id;
		// @ts-ignore
        js.src = "https://connect.facebook.net/en_US/sdk.js";
		// @ts-ignore
		fjs.parentNode.insertBefore(js, fjs);
    }(document, 'script', 'facebook-jssdk'));

    window.fbAsyncInit = function() {
    // Initialize the SDK with your app and the Graph API version for your app
        FB.init({
            appId      : '1225207711991404',
            cookie     : true,
            xfbml      : true,
            version    : 'v20.0'
        });
        FB.AppEvents.logPageView();   
    };
	/* eslint-enable */

    console.log('FB SDK initialized');
}

export const FBLogin = async (): Promise<boolean> => {
	
	// Return a promise to handle the async operation
	/* eslint-disable */
		
	return new Promise((resolve) => {

		FB.getLoginStatus(async (response: any) => {
			console.log(response);
			if (response.status === 'connected' && response.authResponse.expiresIn > 0) {
			  // If you are logged in, automatically get your userID and access token, your public profile information -->
			  const {userID, accessToken, expiresIn} = response.authResponse;
			  const res = await saveAccessToken(userID, accessToken, expiresIn); // Save the access token to the database
			  if (res.status === 'success') {
				Cookies.set(TOKEN_KEY, res.jwtToken, {
				  expires: 7,
				  sameSite: 'None',
				  secure: true,
				  httpOnly: false,
				}); // Create a cookie with the JWT token
				resolve(true);
			  } else { resolve(false); }
			} else {
			  FB.login((response: any) => {
				if (response.authResponse) {
				//   If you are logged in, automatically get your userID and access token, your public profile information -->
				  const {userID, code} = response.authResponse;
				  saveAccessToken(userID, code).then((res: any) => {
						console.log(res);
					  if (res.status === 'success') {
						Cookies.set(TOKEN_KEY, res.jwtToken, {
						  expires: 7,
						  sameSite: 'None',
						  secure: true,
						  httpOnly: false,
						}); // Create a cookie with the JWT token
						resolve(true);
					  } else { resolve(false); }
				  }); // Save the access token to the database
				} else { 
				  // If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email
				  console.log('User cancelled login or did not fully authorize.'); 
				  resolve(false);
				}
			  }, {});
			}
		});
		/* eslint-enable */
	});
}