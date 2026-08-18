create or replace function public.cleanup_user_broadcast_refs(target_user_id uuid)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update notification_broadcasts
  set recipient_user_ids = array_remove(recipient_user_ids, target_user_id)
  where target_user_id = any(recipient_user_ids);
end;
$$;

revoke execute on function public.cleanup_user_broadcast_refs(uuid) from public, anon, authenticated;
