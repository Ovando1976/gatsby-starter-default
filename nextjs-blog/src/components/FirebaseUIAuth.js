import React, { useEffect, useState } from 'react';
import 'firebaseui/dist/firebaseui.css';
var firebase = require('firebase');
var firebaseui = require('firebaseui');
// Initialize the FirebaseUI Widget using Firebase.
var ui = new firebaseui.auth.AuthUI(firebase.auth());



var uiConfig = {
  callbacks: {
    signInSuccessWithAuthResult: function(authResult, redirectUrl) {
      // User successfully signed in.
      // Return type determines whether we continue the redirect automatically
      // or whether we leave that to developer to handle.
      return true;
    },
    uiShown: function() {
      // The widget is rendered.
      // Hide the loader.
      document.getElementById('loader').style.display = 'none';
    }
  },
  // Will use popup for IDP Providers sign-in flow instead of the default, redirect.
  signInFlow: 'popup',
  signInSuccessUrl: '<url-to-redirect-to-on-success>',
  signInOptions: [
    // Leave the lines as is for the providers you want to offer your users.
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
    firebase.auth.FacebookAuthProvider.PROVIDER_ID,
    firebase.auth.TwitterAuthProvider.PROVIDER_ID,
    firebase.auth.GithubAuthProvider.PROVIDER_ID,
    firebase.auth.PhoneAuthProvider.PROVIDER_ID
  ],
  // Terms of service url.
  tosUrl: '<your-tos-url>',
  // Privacy policy url.
  privacyPolicyUrl: '<your-privacy-policy-url>'
}; 

// The start method will wait until the DOM is loaded.
ui.start('#firebaseui-auth-container', uiConfig);

function AuthStateTracker() {
  const [authInfo, setAuthInfo] = useState(null);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const { displayName, email, phoneNumber, photoURL, uid } = user;
        setAuthInfo({
          status: `Signed in as ${displayName || email || phoneNumber}`,
          signInText: 'Sign out',
          accountDetails: JSON.stringify({ displayName, email, phoneNumber, photoURL, uid }, null, 2)
        });
      } else {
        setAuthInfo({
          status: 'Signed out',
          signInText: 'Sign in',
          accountDetails: ''
        });
      }
    });
  }, []);

  return (
    <div>
      <h1>Welcome to the USVIexplorer App</h1>
       <div id="loader">Loading...</div>
      <div>{authInfo?.status}</div>
      <div>{authInfo?.signInText}</div>
      <pre>{authInfo?.accountDetails}</pre>
      <div id="firebaseui-auth-container"></div>
    </div>
  );
}

export default AuthStateTracker;