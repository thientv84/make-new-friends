class PagesController < ApplicationController

  def home
    @params = params
                # rest_graph originates from the rest_graph gem.
                # rest_graph was initialized in the application_controller.rb
    @room = Room.assign params, request.remote_ip, rest_graph
    p @room
  end
  
  def rooms
    if (request.xhr?)
      render :json => Room.rooms(params[:session_id]) and return 
    end
  end
end
