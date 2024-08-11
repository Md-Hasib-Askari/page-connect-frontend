import { saveAccessToken } from '@/api/fetchAPI';
import { APP_ID, FB_CONFIG_ID, TOKEN_KEY } from './constants';

export const fbInit = async () => {
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

	// ts-ignore
	(window as any).fbAsyncInit = function() {
    // Initialize the SDK with your app and the Graph API version for your app
        (FB as any).init({
            appId      : APP_ID,
            cookie     : true,
            xfbml      : true,
            version    : 'v20.0'
        });
        FB.AppEvents.logPageView();

		console.log('FB SDK initialized');
    };
	/* eslint-enable */
	// check for facebook login session
	if (sessionStorage.getItem(`fbssls_${APP_ID}`)) {
		console.log('Facebook session found');
		const fbSession = JSON.parse(sessionStorage.getItem(`fbssls_${APP_ID}`) as string);
		const {userID, accessToken, expiresIn} = fbSession.authResponse;

		const res = await saveAccessToken(userID, accessToken, expiresIn); // Save the access token to the database
		if (res.status === 'success') {
			sessionStorage.setItem(TOKEN_KEY, res.jwtToken);
			return new Promise((resolve) => resolve(true));		
		}
	}
	return new Promise((resolve) => resolve(false));

};

export const FBLogin = async (): Promise<any> => {
	
	// Return a promise to handle the async operation
	/* eslint-disable */
	// @ts-ignore
	return new Promise((resolve) => {
		(FB as any).getLoginStatus(async (response: any) => {
			// Check if the user is logged in and the access token is still valid
			
			if (response.status === 'connected' && response.authResponse?.expiresIn > 0) {
			  // If you are logged in, automatically get your userID and access token, your public profile information -->
			  const {userID, accessToken, expiresIn} = response.authResponse;
			  const expireCookie = Date.now() + expiresIn*1000-1000;

			  const res = await saveAccessToken(userID, accessToken, expiresIn); // Save the access token to the database
			  if (res.status === 'success') {
				sessionStorage.setItem(TOKEN_KEY, res.jwtToken);
				resolve(true);
			  } else { resolve(false); }
			} else {
			  (FB as any).login((response: any) => {
				// handle the response
				if (response.authResponse?.accessToken) {
					//   If you are logged in, automatically get your userID and access token, your public profile information -->
					console.log(response.authResponse);
					
					const {userID, accessToken, expiresIn} = response.authResponse;
					saveAccessToken(userID, accessToken, expiresIn).then((res: any) => {
						
					if (res.status === 'success') {
						sessionStorage.setItem(TOKEN_KEY, res.jwtToken);
						resolve(true);
					} else { resolve(false); }
				  }); // Save the access token to the database
				} else { 
				  // If you are not logged in, the login dialog will open for you to login asking for permission to get your public profile and email
				  console.log('User cancelled login or did not fully authorize.'); 
				  resolve(false);
				}
			  }, {
				config_id: FB_CONFIG_ID,
			  });
			}
		});
		/* eslint-enable */
	});
};