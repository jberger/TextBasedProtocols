#!/usr/bin/env perl
use strict;
use warnings;

select STDERR;

while (<>) {
  print;
  select STDOUT if /^\s*$/;
}
