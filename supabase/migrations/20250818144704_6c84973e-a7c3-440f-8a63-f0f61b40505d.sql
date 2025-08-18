-- Create profiles for existing users who don't have them
INSERT INTO public.profiles (user_id, full_name)
SELECT 
  au.id,
  COALESCE(au.raw_user_meta_data ->> 'full_name', split_part(au.email, '@', 1))
FROM auth.users au
LEFT JOIN public.profiles p ON p.user_id = au.id
WHERE p.user_id IS NULL;