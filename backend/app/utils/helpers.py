"""Helper functions for data processing and utility tasks."""

import logging
from datetime import datetime, timedelta
from typing import Dict, List, Any, Optional
import json

logger = logging.getLogger(__name__)

def format_datetime(dt_str: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """
    Format a GitHub ISO datetime string to a more readable format.
    
    Args:
        dt_str: ISO datetime string
        format_str: Output format string
    
    Returns:
        Formatted datetime string
    """
    try:
        dt = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%SZ")
        return dt.strftime(format_str)
    except Exception as e:
        logger.error(f"Error formatting datetime {dt_str}: {str(e)}")
        return dt_str


def time_since(dt_str: str) -> str:
    """
    Calculate human-readable time since a GitHub ISO datetime.
    
    Args:
        dt_str: ISO datetime string
    
    Returns:
        Human-readable time elapsed string
    """
    try:
        dt = datetime.strptime(dt_str, "%Y-%m-%dT%H:%M:%SZ")
        now = datetime.utcnow()
        diff = now - dt
        
        if diff.days > 365:
            years = diff.days // 365
            return f"{years} year{'s' if years != 1 else ''} ago"
        elif diff.days > 30:
            months = diff.days // 30
            return f"{months} month{'s' if months != 1 else ''} ago"
        elif diff.days > 0:
            return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
        elif diff.seconds > 3600:
            hours = diff.seconds // 3600
            return f"{hours} hour{'s' if hours != 1 else ''} ago"
        elif diff.seconds > 60:
            minutes = diff.seconds // 60
            return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
        else:
            return "just now"
    except Exception as e:
        logger.error(f"Error calculating time since {dt_str}: {str(e)}")
        return "unknown time ago"


def serialize_datetime(obj: Any) -> Any:
    """
    JSON serializer for datetime objects.
    
    Args:
        obj: Object to serialize
    
    Returns:
        JSON serializable object
    """
    if isinstance(obj, datetime):
        return obj.isoformat()
    raise TypeError(f"Type {type(obj)} not serializable")


def calculate_percentage(value: int, total: int) -> float:
    """
    Calculate percentage with error handling.
    
    Args:
        value: Value to calculate percentage for
        total: Total value
    
    Returns:
        Percentage value rounded to 2 decimal places
    """
    if total == 0:
        return 0.0
    return round((value / total) * 100, 2)


def group_by_date(data: List[Dict[str, Any]], 
                  date_key: str, 
                  count_key: Optional[str] = None) -> Dict[str, Any]:
    """
    Group data by date.
    
    Args:
        data: List of dictionaries containing data to group
        date_key: Key in dictionaries containing date string
        count_key: Optional key to use for counting instead of simple counting
    
    Returns:
        Dictionary with dates as keys and counts as values
    """
    result = {}
    
    for item in data:
        if date_key not in item:
            continue
            
        date_str = item[date_key][:10] 
        
        if date_str not in result:
            result[date_str] = 0
            
        if count_key and count_key in item:
            result[date_str] += item[count_key]
        else:
            result[date_str] += 1
            
    return result


def format_bytes(size_bytes: int) -> str:
    """
    Format bytes to human-readable format.
    
    Args:
        size_bytes: Size in bytes
    
    Returns:
        Human-readable string representation of file size
    """
    if size_bytes == 0:
        return "0 B"
        
    size_name = ("B", "KB", "MB", "GB", "TB", "PB")
    i = 0
    while size_bytes >= 1024 and i < len(size_name) - 1:
        size_bytes /= 1024
        i += 1
        
    return f"{size_bytes:.2f} {size_name[i]}"


def generate_color_palette(n: int) -> List[str]:
    """
    Generate a list of n distinct colors for charts.
    
    Args:
        n: Number of colors to generate
    
    Returns:
        List of hex color codes
    """

    base_colors = [
        "#4285F4", "#EA4335", "#FBBC05", "#34A853",  # Google colors
        "#00A1F1", "#7CBB00", "#F65314", "#FFBB00",  # Microsoft colors
        "#5C2D91", "#0078D7", "#008272", "#FFB900",  # More Microsoft colors
        "#B4A7D6", "#A2C4C9", "#D5A6BD", "#C9DAF8"   # Pastel colors
    ]
    
    if n <= len(base_colors):
        return base_colors[:n]
    
    colors = []
    for i in range(n):
        hue = int(i * 360 / n)
        saturation = 70 + (i % 3) * 10  
        lightness = 45 + (i % 2) * 10  
        
        h = hue / 360
        s = saturation / 100
        l = lightness / 100
        
        if s == 0:
            r = g = b = l
        else:
            def hue_to_rgb(p, q, t):
                if t < 0:
                    t += 1
                if t > 1:
                    t -= 1
                if t < 1/6:
                    return p + (q - p) * 6 * t
                if t < 1/2:
                    return q
                if t < 2/3:
                    return p + (q - p) * (2/3 - t) * 6
                return p
                
            q = l * (1 + s) if l < 0.5 else l + s - l * s
            p = 2 * l - q
            r = hue_to_rgb(p, q, h + 1/3)
            g = hue_to_rgb(p, q, h)
            b = hue_to_rgb(p, q, h - 1/3)
        
        r, g, b = [int(x * 255) for x in (r, g, b)]
        colors.append(f"#{r:02x}{g:02x}{b:02x}")
    
    return colors


def merge_dict_values(dict_list: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Merge values from multiple dictionaries summing numeric values.
    
    Args:
        dict_list: List of dictionaries to merge
    
    Returns:
        Dictionary with merged values
    """
    result = {}
    
    for d in dict_list:
        for key, value in d.items():
            if key in result:
                if isinstance(value, (int, float)) and isinstance(result[key], (int, float)):
                    result[key] += value
                elif isinstance(value, dict) and isinstance(result[key], dict):
                    result[key] = merge_dict_values([result[key], value])
                elif isinstance(value, list) and isinstance(result[key], list):
                    result[key].extend(value)
                else:
                    result[key] = value
            else:
                result[key] = value
                
    return result