-- Run this in Supabase SQL Editor after creating the kyc-documents bucket

-- Allow authenticated users to upload their own KYC documents
create policy "Users can upload their own KYC docs"
  on storage.objects for insert
  with check (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );

-- Allow authenticated users to view their own KYC documents
create policy "Users can view their own KYC docs"
  on storage.objects for select
  using (
    bucket_id = 'kyc-documents' AND
    auth.uid()::text = (storage.foldername(name))[2]
  );
