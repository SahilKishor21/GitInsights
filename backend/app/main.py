import uvicorn
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exception_handlers import http_exception_handler
from fastapi.exceptions import RequestValidationError
import time
import logging
import traceback
import sys
from datetime import datetime

from app.api.routes import router as api_router
from app.config import settings


logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


app = FastAPI(
    title="GitHub Insights API",
    description="API for fetching and analyzing GitHub user and repository data",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    """
    Middleware to add processing time to response headers.
    
    Args:
        request: Request object
        call_next: Next middleware in chain
        
    Returns:
        Response with X-Process-Time header added
    """
    start_time = time.time()
    response = await call_next(request)
    process_time = time.time() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    return response

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    """
    Handle validation errors.
    
    Args:
        request: Request object
        exc: RequestValidationError
        
    Returns:
        JSONResponse with validation error details
    """
    logger.warning(f"Validation error: {str(exc)}")
    
    errors = []
    for error in exc.errors():
        error_loc = " -> ".join([str(loc) for loc in error["loc"]])
        errors.append({
            "location": error_loc,
            "message": error["msg"],
            "type": error["type"]
        })
    
    return JSONResponse(
        status_code=422,
        content={
            "detail": "Validation error",
            "errors": errors
        }
    )

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    """
    Global exception handler.
    
    Args:
        request: Request object
        exc: Exception
        
    Returns:
        JSONResponse with error details
    """
    error_id = f"ERR-{datetime.now().strftime('%Y%m%d%H%M%S')}-{id(exc)}"
    

    error_msg = f"Unhandled exception {error_id}: {str(exc)}"
    logger.error(error_msg, exc_info=True)

    if settings.DEBUG:
        tb = traceback.format_exception(type(exc), exc, exc.__traceback__)
        return JSONResponse(
            status_code=500,
            content={
                "detail": "An internal server error occurred",
                "error_id": error_id,
                "traceback": tb
            }
        )
    
    # In production
    return JSONResponse(
        status_code=500,
        content={
            "detail": "An internal server error occurred",
            "error_id": error_id
        }
    )


app.include_router(api_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
async def read_root():
    """
    Root endpoint returns API information.
    
    Returns:
        Dict with API information
    """
    return {
        "name": "GitHub Insights API",
        "version": "1.0.0",
        "documentation": "/docs",
        "status": "operational"
    }

# Health check 
@app.get("/health", tags=["Health"])
async def health_check():
    """
    Health check endpoint.
    
    Returns:
        Dict with health status
    """
    return {"status": "healthy"}

if __name__ == "__main__":
    uvicorn.run(
        "app.main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )