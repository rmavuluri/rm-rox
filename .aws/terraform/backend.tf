terraform {
  backend "s3" {
    bucket = "rm-rox-us-east-1-079719181907-tf-states"
    key    = "rm-rox/terraform.tfstate"
    region = "us-east-1",
    encrypt = true
  }
} 