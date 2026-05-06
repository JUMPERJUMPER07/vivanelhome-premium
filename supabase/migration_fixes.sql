-- Migration: corrige banco existente
-- Execute no SQL Editor do Supabase

-- 1. Adiciona coluna sold_label (estava faltando no schema original)
alter table public.custom_products
  add column if not exists sold_label text not null default '';

-- 2. Cria sequencia para substituir Date.now() como gerador de ID
--    (só necessario se a tabela ja existia com id bigint manual)
do $$
begin
  if not exists (
    select 1 from information_schema.columns
    where table_name = 'custom_products'
      and column_name = 'id'
      and column_default like 'nextval%'
  ) then
    create sequence if not exists public.custom_products_id_seq
      as bigint
      start with 1
      increment by 1
      no minvalue
      no maxvalue
      cache 1;

    -- Ajusta o inicio da sequencia para ser maior que o maior ID existente
    perform setval(
      'public.custom_products_id_seq',
      coalesce((select max(id) from public.custom_products), 0) + 1,
      false
    );

    alter table public.custom_products
      alter column id set default nextval('public.custom_products_id_seq');

    alter sequence public.custom_products_id_seq
      owned by public.custom_products.id;
  end if;
end;
$$;
