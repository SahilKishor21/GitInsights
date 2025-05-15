import os
import multiprocessing

host = os.getenv("HOST", "0.0.0.0")
port = os.getenv("PORT", "8000")
workers_per_core = float(os.getenv("WORKERS_PER_CORE", "1"))
max_workers = int(os.getenv("MAX_WORKERS", "0"))
workers_multiplier = float(os.getenv("WORKERS_MULTIPLIER", "1"))
use_max_workers = max_workers > 0

bind = f"{host}:{port}"
worker_class = "uvicorn.workers.UvicornWorker"
keepalive = 120
timeout = 120

cores = multiprocessing.cpu_count()
default_web_concurrency = int(workers_per_core * cores * workers_multiplier)
web_concurrency = max(max_workers, default_web_concurrency) if use_max_workers else default_web_concurrency
workers = web_concurrency


accesslog = "-"  
errorlog = "-"   
loglevel = os.getenv("LOG_LEVEL", "info")

#timeout
graceful_timeout = int(os.getenv("GRACEFUL_TIMEOUT", "120"))

# For debugging and testing
log_data = {
    "workers": workers,
    "cores": cores,
    "host": host,
    "port": port,
    "bind": bind,
    "worker_class": worker_class,
    "workers_per_core": workers_per_core,
    "workers_multiplier": workers_multiplier,
    "max_workers": max_workers,
    "use_max_workers": use_max_workers,
}

print(log_data)