variable "aws_region" {
  description = "AWS region to deploy resources in."
  type        = string
}

variable "vpc_cidr" {
  description = "CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnets" {
  description = "List of public subnet CIDRs."
  type        = list(string)
}

variable "private_subnets" {
  description = "List of private subnet CIDRs."
  type        = list(string)
}

variable "db_username" {
  description = "Database master username."
  type        = string
}

variable "db_password" {
  description = "Database master password."
  type        = string
  sensitive   = true
}

variable "db_name" {
  description = "Database name."
  type        = string
  default     = "appdb"
}

variable "ecr_backend_repo_name" {
  description = "ECR repository name for backend."
  type        = string
}

variable "ecr_frontend_repo_name" {
  description = "ECR repository name for frontend."
  type        = string
} 