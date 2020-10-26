#!/usr/bin/env bash
# -*- coding: utf-8 -*-
echo "Dropping users collection"
mongo jsramverkProject --eval "db.users.drop()" > /dev/null
echo "Dropping accounts collection"
mongo jsramverkProject --eval "db.accounts.drop()" > /dev/null
echo "Dropping stocks collection"
mongo jsramverkProject --eval "db.stocks.drop()" > /dev/null
echo "Dropping stockshistories collection"
mongo jsramverkProject --eval "db.stockshistories.drop()" > /dev/null
