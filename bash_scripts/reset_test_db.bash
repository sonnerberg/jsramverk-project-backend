#!/usr/bin/env bash
# -*- coding: utf-8 -*-
echo "Dropping users collection"
mongo jsramverkProjectTest --eval "db.users.drop()" > /dev/null
echo "Dropping accounts collection"
mongo jsramverkProjectTest --eval "db.accounts.drop()" > /dev/null
echo "Dropping stocks collection"
mongo jsramverkProjectTest --eval "db.stocks.drop()" > /dev/null
echo "Dropping stockshistories collection"
mongo jsramverkProjectTest --eval "db.stockshistories.drop()" > /dev/null
