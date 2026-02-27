import * as WebBrowser from 'expo-web-browser';
import { makeRedirectUri, useAuthRequest } from 'expo-auth-session';
import { TouchableOpacity, Text } from 'react-native';
import { supabase } from '@/lib/supabase';
import { router } from 'expo-router'; // เพิ่มบรรทัดนี้

if (typeof window !== 'undefined') {
  WebBrowser.maybeCompleteAuthSession();
}

export default function LoginScreen() {
  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: 'YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com',
      scopes: ['profile', 'email'],
      redirectUri: makeRedirectUri({ scheme: 'gongin-mobile' }),
    },
    {
      authorizationEndpoint: 'https://accounts.google.com/o/oauth2/v2/auth',
      tokenEndpoint: 'https://www.googleapis.com/oauth2/v4/token',
      revocationEndpoint: 'https://oauth2.googleapis.com/revoke',
    },
  );

  const handleGoogleLogin = async () => {
    const result = await promptAsync();
    if (result.type === 'success') {
      const { id_token } = result.params;
      const { error } = await supabase.auth.signInWithIdToken({
        provider: 'google',
        token: id_token,
      });

      if (!error) {
        // ล็อคอินสำเร็จ ให้วิ่งไปหน้าหลัก (Tabs)
        router.replace('/(tabs)'); // ใช้ router.replace เพื่อไม่ให้ผู้ใช้กลับมาที่หน้า Login ได้ด้วยปุ่ม Back
      }
    }
  };

  return (
    <TouchableOpacity
      className="bg-primary items-center rounded-xl p-4"
      onPress={handleGoogleLogin}
    >
      <Text className="text-xl font-bold text-white">เข้าสู่ระบบด้วย Google</Text>
    </TouchableOpacity>
  );
}
