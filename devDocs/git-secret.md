## Istall git-secret

`brew-install git-secret`

## Generate a key

`gpg --gen-key`

## Import everyone else's keys

`/tools/script/import_export_pulbic_keys.sh`

## Add a file to git-secret

`git secret add config/.env`

## Give people access to the file

`git secret tell <EMAIL>` (author file)

## Automatic command to give access to everyone on team

`/tools/script/allow_team_access.sh`

## Encrypt

`git secret hide`

## Decrypt

`git secret reveal`




