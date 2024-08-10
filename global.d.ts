declare global {
    interface Window {
        FB:any;
        fbAsyncInit: () => void;
    }
}

let FB = window.FB; // ok now