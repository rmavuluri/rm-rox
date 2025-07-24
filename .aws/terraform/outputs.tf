output "alb_dns_name" {
  description = "DNS name of the Application Load Balancer"
  value       = aws_lb.app_alb.dns_name
}

output "rds_endpoint" {
  description = "RDS endpoint"
  value       = aws_db_instance.app_db.endpoint
}

output "ecr_backend_repo_url" {
  description = "ECR backend repo URL"
  value       = aws_ecr_repository.backend.repository_url
}

output "ecr_frontend_repo_url" {
  description = "ECR frontend repo URL"
  value       = aws_ecr_repository.frontend.repository_url
} 