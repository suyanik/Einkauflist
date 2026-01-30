
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function Auth() {
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isSignUp, setIsSignUp] = useState(false);

    const handleAuth = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isSignUp) {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success('Kayıt başarılı! Lütfen e-postanızı kontrol edin.');
            } else {
                const { error } = await supabase.auth.signInWithPassword({
                    email,
                    password,
                });
                if (error) throw error;
                toast.success('Giriş yapıldı!');
            }
        } catch (error: any) {
            toast.error(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center p-4 bg-slate-50">
            <Card className="w-full max-w-md">
                <CardHeader>
                    <CardTitle>{isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}</CardTitle>
                    <CardDescription>
                        {isSignUp
                            ? 'Mutfak ekibine katılmak için hesap oluşturun.'
                            : 'Listenize erişmek için giriş yapın.'}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleAuth} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">E-posta</Label>
                            <Input
                                id="email"
                                type="email"
                                placeholder="ornek@mutfak.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Şifre</Label>
                            <Input
                                id="password"
                                type="password"
                                placeholder="******"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                        <div className="flex flex-col gap-2">
                            <Button type="submit" disabled={loading} className="w-full">
                                {loading ? 'İşleniyor...' : isSignUp ? 'Kayıt Ol' : 'Giriş Yap'}
                            </Button>
                        </div>
                        <div className="text-center text-sm">
                            <button
                                type="button"
                                className="text-primary hover:underline"
                                onClick={() => setIsSignUp(!isSignUp)}
                            >
                                {isSignUp
                                    ? 'Zaten hesabınız var mı? Giriş yapın'
                                    : 'Hesabınız yok mu? Kayıt olun'}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
