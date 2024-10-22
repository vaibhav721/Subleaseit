// mixpanelInit.js
import mixpanel from "mixpanel-browser";

// Replace 'YOUR_MIXPANEL_PROJECT_TOKEN' with your actual Mixpanel project token/key
mixpanel.init(process.env.REACT_APP_MixPanel_Token);

export default mixpanel;
