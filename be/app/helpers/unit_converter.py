import logging

from pint import UnitRegistry

logger = logging.getLogger(__name__)

ureg = UnitRegistry()


def convert_units(amount: float, from_unit: str, to_unit: str) -> float:
    """
    Converts a value from one unit to another.

    Args:
      amount: The amount of the from unit
      from_unit: The unit of the input value.
      to_unit: The desired unit for the output.

    Returns:
      The converted value
    """
    try:
        factor = 1 * ureg(from_unit)
        converted = factor.to(to_unit).magnitude
        logger.info(f"{from_unit} converts to {to_unit} at a factor of {converted}")
        return converted * amount
    except Exception as e:
        logger.eror(f"Error during unit conversion: {e}")
        logger.exception(e)
        raise e


def check_if_unit(from_unit: str, to_unit: str):
    print("check unit")
    if from_unit.lower() in ["unit", "units"] and to_unit.lower() in ["unit", "units"]:
        return True
    return False


def get_converted_amount(amount: float, from_unit: str, to_unit: str) -> float:
    print(f"Attempting to convert {from_unit} to {to_unit}")
    if check_if_unit(from_unit=from_unit, to_unit=to_unit):
        return amount
    else:
        return convert_units(amount, from_unit, to_unit)
