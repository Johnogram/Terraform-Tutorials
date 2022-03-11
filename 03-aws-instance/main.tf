terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 3.27"
    }
  }

  required_version = ">= 0.14.9"
}

provider "aws" {
  profile = "johnogram"
  region  = "eu-west-1"
}

resource "aws_instance" "app_server" {
  # ami           = "ami-ee0b0688"
  ami           = "ami-09b49c48928db765c"
  instance_type = "t2.micro"

  tags = {
    Name = var.instance_name
  }
}
