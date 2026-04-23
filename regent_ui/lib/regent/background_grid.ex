defmodule Regent.BackgroundGrid do
  use Phoenix.Component

  attr :id, :string, required: true
  attr :class, :any, default: nil
  attr :rest, :global

  def background_grid(assigns) do
    ~H"""
    <div id={@id} class={["rg-background-grid", @class]} aria-hidden="true" {@rest} />
    """
  end
end
