create or replace function public.consume_free_credit(uid uuid)
returns integer
language plpgsql
as $$
declare
  remaining integer;
begin
  update public.user_credits
  set credits = credits - 1,
      updated_at = now()
  where user_id = uid
    and credits > 0
  returning credits into remaining;

  if remaining is null then
    return -1; -- limit reached (no decrement happened)
  end if;

  return remaining;
end;
$$;
