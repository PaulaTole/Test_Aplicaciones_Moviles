import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'io.ionic.starter',
  appName: 'Test_Apliaciones_Moviles',
  webDir: 'www', 
  server: {
    androidScheme: 'https' ,
    cleartext: true
  },
  plugins: {
    CapacitorSQLite: {
      iosDatabaseLocation: 'Library/CapacitorDatabase',
      androidIsEncryption: false
    }
  }
};

export default config;
