// nodemailer.d.ts
declare module 'nodemailer' {
    import { Transport, TransportOptions } from 'nodemailer';

    function createTransport(options: TransportOptions): Transport;

    export = {
        createTransport
        // Add other exported members from nodemailer here
    };
}
